def sort_by_type(results):
    res = {}
    for item in results:
        res.setdefault(item['type'], []).append(item)
    return res

def sort_by_category(results):
    menu_data = results.get('dishes', None)
    sorted_dishes = {}
    if menu_data:
        for item in menu_data:
            category_name = item.get('category', {}).get('name', 'Uncategorized')
            sorted_dishes.setdefault(category_name, []).append(item)
    
    if 'dishes' in results:  
        del results['dishes']
    results['dishes'] = sorted_dishes  
    return results