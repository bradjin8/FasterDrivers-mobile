def sort_by_type(results):
    res = {}
    for item in results:
        res.setdefault(item['type'], []).append(item)
    return res

# def sort_by_category(results):
#     menu_data = results.get('dishes', None)
#     sorted_dishes = {}
#     if menu_data:
#         for item in menu_data:
#             category = item.get('category')
#             if category:
#                 category_name = category.get('name', 'Uncategorized')
#             else:
#                 category_name = 'Uncategorized'
#             sorted_dishes.setdefault(category_name, []).append(item)
    
#     if 'dishes' in results:  
#         del results['dishes']
#     results['dishes'] = sorted_dishes  
#     return results

def sort_by_category(results):
    menu_data = results.get('dishes', None)
    sorted_dishes = {}

    if menu_data:
        for item in menu_data:
            # Check if 'category' is empty or None
            category = item['category'] if item['category'] else "Uncategorized"
            
            sorted_dishes.setdefault(category, []).append(item)
    
    if 'dishes' in results:  
        del results['dishes']
    results['dishes'] = sorted_dishes

    return results